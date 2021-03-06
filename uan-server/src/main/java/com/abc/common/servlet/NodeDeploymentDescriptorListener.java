/*
 * Copyright 2018 Liu Bo
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.abc.common.servlet;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.abc.common.util.LogWriter;

/**
 * @author liubo 获取node
 */
public class NodeDeploymentDescriptorListener implements ServletContextListener {
	/**
	 * WAS上下文获取服务器名称的属性名称
	 */
	private static final String WASATTRIBUTE = "com.ibm.websphere.servlet.application.host";

	@Override
	public void contextDestroyed(ServletContextEvent event) {
	}

	@Override
	public void contextInitialized(ServletContextEvent event) {

		Object deploymentDescriptor = event.getServletContext().getAttribute(WASATTRIBUTE);

		if (deploymentDescriptor != null) {
			NodeDeploymentDescriptor.getInstance().setDeploymentDescriptor(deploymentDescriptor.toString());
			LogWriter.info(NodeDeploymentDescriptorListener.class, "WAS NodeDeploymentDescriptor is {}",
					deploymentDescriptor.toString());
		}
	}
}
